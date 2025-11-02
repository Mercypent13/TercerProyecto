import { Component, inject } from '@angular/core';
import { Category, Obra } from '../../shared/interfaces/data-interfaces';
import { ObrasServices } from '../../core/services/obras-services';
import { RouterLink } from '@angular/router';
import { CategoryServices } from '../../core/services/categorias-services';
import { CommonModule } from '@angular/common';
import { Footer } from "../../shared/components/footer/footer";
import { NavBar } from "../../shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-galeria',
  imports: [RouterLink, CommonModule, Footer, NavBar],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria {
  arrayCategories: Category[] = [];
  artworks: Obra[] = [];
  isLoading: boolean = true;
  selectedCategory: string = 'Todos'; 

  private _artworkService = inject(ObrasServices);
  private _categoryService = inject(CategoryServices);
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadArtworks(category);
  }

  loadCategories(): void {
    this._categoryService.getAllcategorias().subscribe({
      next: (response) => {
        if (response && response.data) {
           this.arrayCategories = response.data;
        } else {
           this.arrayCategories = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  loadArtworks(category: string = 'Todos'): void {
    this.isLoading = true;

    this._artworkService.getAllArtworks().subscribe({
      next: (response) => {
        let allArtworks: Obra[] = [];
        
        if (response && response.data && response.data.obras) {
          allArtworks = response.data.obras;
        } else if (response && response.data) {
          allArtworks = response.data;
        }

        if (category === 'Todos') {
          this.artworks = allArtworks;
        } else {
          this.artworks = allArtworks.filter(obra => 
            obra.categorias && obra.categorias.includes(category)
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar obras en la galería:', err);
        this.isLoading = false;
      }
    });
  }
}
