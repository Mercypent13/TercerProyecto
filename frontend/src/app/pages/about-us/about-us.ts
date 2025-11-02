import { Component, signal } from '@angular/core';
import { NavBar } from "../../shared/components/nav-bar/nav-bar";
import { Footer } from "../../shared/components/footer/footer";
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about-us',
  imports: [NavBar, Footer, RouterLink, CommonModule, FormsModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  public contactData = { email: '', message: '' };
  public contactMessage = signal<string | null>(null);

  submitContactForm(): void {
    if (!this.contactData.email || !this.contactData.message) {
        this.contactMessage.set('Por favor, completa todos los campos.');
        return;
    }
    
    const personalEmail = 'tucorreopersonal@ejemplo.com'; 
    
    console.log('--- Formulario de Contacto Enviado Simulado ---');
    console.log('Remitente:', this.contactData.email);
    console.log('Mensaje:', this.contactData.message);
    console.log('Destinatario Simulado (Personal):', personalEmail);
    
    this.contactMessage.set(`Tu mensaje ha sido enviado correctamente y sería dirigido a ${personalEmail}. ¡Gracias por contactarnos!`);
    
    // Limpiar formulario después del envío simulado
    this.contactData = { email: '', message: '' };
  }

}
