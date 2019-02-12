import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbThemeModule,
  NbSidebarModule,
  NbLayoutModule,
  NbCardModule,
  NbMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbToastrModule,
  NbDialogModule,
  NbWindowModule,
} from '@nebular/theme';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
  ],
  exports: [NbThemeModule, NbSidebarModule, NbLayoutModule, NbCardModule, NbMenuModule],
})
export class NebularModule {}
