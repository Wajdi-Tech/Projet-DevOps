package handlers

import (
	"os"
	"path/filepath"
	"strconv"

	"product-catalogue/database"
	"product-catalogue/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CreateProduct handles POST /products with optional image upload
func CreateProduct(c *fiber.Ctx) error {
	// Parse form fields
	product := new(models.Product)
	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse form data"})
	}

	// Check for existing product FIRST (before image upload)
	var existingProduct models.Product
	if err := database.DB.Where("LOWER(name) = LOWER(?)", product.Name).First(&existingProduct).Error; err == nil {
		// Product already exists
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "product with this name already exists",
		})
	} else if err != gorm.ErrRecordNotFound {
		// Handle unexpected database errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to check product existence",
		})
	}

	// Handle image upload if provided (AFTER uniqueness check)
	file, err := c.FormFile("image")
	if err == nil {
		// Create uploads folder if it does not exist
		if _, err := os.Stat("uploads"); os.IsNotExist(err) {
			os.Mkdir("uploads", os.ModePerm)
		}

		// Generate a unique filename with UUID
		ext := filepath.Ext(file.Filename)
		filename := uuid.NewString() + ext // Full UUID
		filePath := filepath.Join("uploads", filename)

		// Save the image
		if err := c.SaveFile(file, filePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to save image",
			})
		}

		product.ImageURL = "http://localhost:4000/uploads/" + filename
	}

	// Save product to database
	if err := database.DB.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "cannot create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

// GetProducts handles GET /products
func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot retrieve products"})
	}
	return c.JSON(products)
}

// GetProduct handles GET /products/:id
func GetProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}
	return c.JSON(product)
}

// UpdateProduct handles PUT /products/:id with optional image update
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	// Parse form data
	updatedProduct := new(models.Product)
	if err := c.BodyParser(updatedProduct); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse form data"})
	}

	// Update product fields
	product.Name = updatedProduct.Name
	product.Description = updatedProduct.Description
	product.Category = updatedProduct.Category
	product.Price = updatedProduct.Price
	product.Stock = updatedProduct.Stock

	// Handle optional image update
	file, err := c.FormFile("image")
	if err == nil {
		// Ensure "uploads" folder exists
		_ = os.MkdirAll("uploads", os.ModePerm)

		// Generate a short, unique filename
		ext := filepath.Ext(file.Filename) // Get file extension
		filename := uuid.NewString()[:8] + ext

		filePath := filepath.Join("uploads", filename)

		// Save the new image
		if err := c.SaveFile(file, filePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save image"})
		}

		// Delete old image if it exists
		if product.ImageURL != "" {
			oldFilePath := "." + product.ImageURL
			_ = os.Remove(oldFilePath) // Ignore errors if the file doesn't exist
		}

		// Update the product image URL
		product.ImageURL = "http://localhost:4000/uploads/" + filename
	}

	// Save changes
	if err := database.DB.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot update product"})
	}
	return c.JSON(product)

}

// DeleteProduct handles DELETE /products/:id and removes associated image
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid product ID"})
	}

	// Find product to delete
	var product models.Product
	if err := database.DB.First(&product, idUint).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	// Delete associated image
	if product.ImageURL != "" {
		filePath := "." + product.ImageURL
		os.Remove(filePath)
	}

	// Delete product from database
	if err := database.DB.Delete(&models.Product{}, idUint).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot delete product"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
