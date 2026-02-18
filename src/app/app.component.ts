import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Importations AG Grid (Version 35)
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Importations Material Design
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

// Importation directe du fichier JSON de Frédéric
// Note : Assure-ce que "resolveJsonModule": true est dans ton tsconfig.json
import championData from '../assets/champion_info.json';

// Enregistrement des modules AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // 1. Définition des colonnes
  public columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Nom du Champion',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'title',
      headerName: 'Titre',
      sortable: true,
      filter: true,
      flex: 1.5,
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: () => {
        // Bouton pour le BONUS de suppression
        return `<button style="background-color: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Supprimer</button>`;
      },
      onCellClicked: (params: any) => {
        this.deleteChampion(params.data.id, params.data.name);
      },
    },
  ];

  // 2. Variable qui contient TOUS les champions
  public rowData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadChampions(); // On charge les 137 champions via l'API au démarrage
  }

  loadChampions() {
    this.http.get<any[]>('api/champions').subscribe((data) => {
      this.rowData = data;
      console.log('Liste chargée depuis le service :', data.length);
    });
  }

  resetFilters() {
    // 1. On demande au In-Memory Web API de se réinitialiser complètement
    // Cela remet la base de données dans l'état défini dans DataService
    this.http.post('commands/resetDb', {}).subscribe(() => {
      console.log('Base de données réinitialisée !');

      // 2. Maintenant on recharge la liste qui contient à nouveau les 137 champions
      this.loadChampions();
    });
  }
  // BONUS : Fonction de suppression (CRUD simulé)
  deleteChampion(id: number, name: string) {
    if (confirm(`Voulez-vous supprimer ${name} ?`)) {
      // On retire le champion de la liste affichée
      this.rowData = this.rowData.filter((champ) => champ.id !== id);

      // Optionnel : Appel au "Faux serveur" in-memory
      this.http.delete(`api/champions/${id}`).subscribe({
        next: () => console.log(`${name} supprimé du serveur simulé`),
        error: (err) => console.error('Erreur suppression API', err),
      });
    }
  }
}
