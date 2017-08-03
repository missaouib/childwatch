import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
    imports: [ RouterModule, CommonModule, CollapseModule.forRoot() ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
