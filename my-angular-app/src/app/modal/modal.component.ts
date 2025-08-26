import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}