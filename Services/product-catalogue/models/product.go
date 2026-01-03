// models/product.go
package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string `gorm:"unique;not null"` // Enforce uniqueness
	Description string
	Category    string
	Price       float64
	Stock       uint
	ImageURL    string
}
