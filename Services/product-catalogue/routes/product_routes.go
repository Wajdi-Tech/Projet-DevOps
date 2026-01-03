package routes

import (
	"product-catalogue/handlers"
	"product-catalogue/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterProductRoutes(app *fiber.App) {
	// Public routes (no authentication required)
	public := app.Group("/products")
	public.Get("/", handlers.GetProducts)   // Get all products (public)
	public.Get("/:id", handlers.GetProduct) // Get single product (public)

	// Admin-only routes (JWT authentication + admin role required)
	admin := app.Group("/products", middleware.JWTAuthentication)
	admin.Post("/", middleware.AdminRoleMiddleware, handlers.CreateProduct)      // Create (admin)
	admin.Put("/:id", middleware.AdminRoleMiddleware, handlers.UpdateProduct)    // Update (admin)
	admin.Delete("/:id", middleware.AdminRoleMiddleware, handlers.DeleteProduct) // Delete (admin)
}
