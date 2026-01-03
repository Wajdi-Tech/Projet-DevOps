package main

import (
	"log"

	"product-catalogue/config"
	"product-catalogue/database"
	"product-catalogue/models"
	"product-catalogue/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to the database
	database.Connect(cfg)

	// Auto-migrate the Product model
	if err := database.DB.AutoMigrate(&models.Product{}); err != nil {
		log.Fatalf("Error during migration: %v", err)
	}

	// Initialize Fiber app
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:  "*", // Your Angular app's origin
		AllowMethods:  "GET,POST,PUT,DELETE",
		AllowHeaders:  "Origin, Content-Type, Accept, Authorization",
		ExposeHeaders: "Authorization",
	}))

	// Serve static files from the "uploads" directory
	app.Static("/uploads", "./uploads")

	// Register product routes
	routes.RegisterProductRoutes(app)

	// Start server
	log.Printf("Server is running on port %s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
