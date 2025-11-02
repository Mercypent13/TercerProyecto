import { Component, inject } from '@angular/core';
import { Category, TopObra } from '../../shared/interfaces/data-interfaces';
import { CategoryServices } from '../../core/services/categorias-services';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ObrasServices } from '../../core/services/obras-services';
import { Footer } from "../../shared/components/footer/footer";
import { NavBar } from "../../shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, Footer, NavBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  arrayCategories: Category[] = [];
  topArtworks: TopObra[] = [];
  private _categoryService = inject(CategoryServices);
  private _artworkService = inject(ObrasServices);

  constructor() { }

ngOnInit(): void {
    this.loadCategories();
    this.loadTopArtworks();
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

  loadTopArtworks(): void {
    this._artworkService.getTop3Artworks().subscribe({
      next: (response) => {
        if (response && response.data && response.data.obras) { 
           this.topArtworks = response.data.obras;
        }
      },
      error: (err) => {
        console.error('Error al cargar obras top:', err);
      }
    });
  }
}
