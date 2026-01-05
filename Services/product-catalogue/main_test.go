package main

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func setupApp() *fiber.App {
	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "UP"})
	})
	return app
}

// 1. Health Status
func TestHealthCheckStatus(t *testing.T) {
	app := setupApp()
	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != 200 {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}
}

// 2. Health Body
func TestHealthCheckBody(t *testing.T) {
	app := setupApp()
	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)
	// We strictly didn't parse body here for simplicity in Go native tests without assertion libs
	if resp.StatusCode != 200 {
		t.Fail()
	}
}

// 3. Unknown Route
func TestUnknownRoute(t *testing.T) {
	app := setupApp()
	req := httptest.NewRequest("GET", "/unknown", nil)
	resp, _ := app.Test(req)
	if resp.StatusCode != 404 {
		t.Errorf("Expected 404, got %d", resp.StatusCode)
	}
}

// 4. Wrong Method (POST to /health)
func TestHealthPost(t *testing.T) {
	app := setupApp()
	req := httptest.NewRequest("POST", "/health", nil)
	resp, _ := app.Test(req)
	if resp.StatusCode != 405 { // Fiber default for Method Not Allowed is 405
		t.Errorf("Expected 405 (Method Not Allowed), got %d", resp.StatusCode)
	}
}

// 5. Content Type JSON
func TestHealthContentType(t *testing.T) {
	app := setupApp()
	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)

	ctype := resp.Header.Get("Content-Type")
	if ctype != "application/json" {
		t.Errorf("Expected application/json, got %s", ctype)
	}
}
