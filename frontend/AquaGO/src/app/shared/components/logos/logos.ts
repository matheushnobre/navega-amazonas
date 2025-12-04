import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { enterprise } from '../../models/enterprise';

@Component({
  selector: 'app-logos',
  imports: [CommonModule,FormsModule],
  templateUrl: './logos.html',
  styleUrl: './logos.scss',
})
export class Logos {
@Input()
  items: any[] = [];

  ngOnChanges() {
    if (this.items && this.items.length > 0) {
      this.items = this.normalize(this.items);
    }
  }

  normalize(list: enterprise[]): enterprise[] {
    if (!list || list.length === 0) return [];

    const result = [...list];
    let i = 0;
    const size = 50;

    while (result.length < size) {
      result.push(result[i % list.length]);
      i++;
    }

    return result.slice(0, size);
  }
}

