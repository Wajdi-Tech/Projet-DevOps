package middleware

import (
	"fmt"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// JWTAuthentication middleware to verify the JWT token and protect routes
func JWTAuthentication(c *fiber.Ctx) error {
	// Retrieve the token from the "Authorization" header.
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing or malformed JWT",
		})
	}

	// Remove the "Bearer " prefix, if present.
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing token",
		})
	}

	// Parse and verify the token.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method.
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Return the secret key.
		secret := os.Getenv("JWT_SECRET")
		fmt.Println("Error parsing token:", secret)
		if secret == "" {
			return nil, fmt.Errorf("JWT secret not set in environment")
		}
		return []byte(secret), nil
	})

	// If there's an error during parsing, the token is invalid.
	if err != nil {
		fmt.Println("Error parsing token:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	// Extract claims and check token validity.
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Attach user details to the context for downstream handlers.
		c.Locals("userId", claims["userId"])
		c.Locals("role", claims["role"])
		return c.Next()
	}

	// If token is not valid, return an unauthorized error.
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "Unauthorized",
	})
}

// AdminRoleMiddleware ensures only users with an 'admin' role can access the route
func AdminRoleMiddleware(c *fiber.Ctx) error {
	role := c.Locals("role").(string)
	fmt.Println("role")
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden: Admin access required",
		})
	}
	return c.Next() // Allow access to the route
}

// ClientRoleMiddleware ensures only users with a 'client' role can access the route
func ClientRoleMiddleware(c *fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "client" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Forbidden: Client access required",
		})
	}
	return c.Next() // Allow access to the route
}
