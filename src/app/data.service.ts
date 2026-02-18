import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import championData from '../assets/champion_info.json'; // Import du gros fichier

@Injectable({ providedIn: 'root' })
export class DataService implements InMemoryDbService {
  createDb() {
    // On transforme l'objet "data" du JSON en tableau de 137 champions
    const champions = Object.values(championData.data);

    return { champions };
  }
}
