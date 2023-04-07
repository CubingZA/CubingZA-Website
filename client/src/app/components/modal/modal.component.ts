import { Component, ElementRef, Input } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent {

  @Input() id?: string;
  isOpen = false;

  constructor(
    private modalService: ModalService,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.modalService.add(this);
    const nativeElement = this.element.nativeElement;
    
    document.body.appendChild(nativeElement);

    nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.modalService.remove(this);
    this.element.nativeElement.remove();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
