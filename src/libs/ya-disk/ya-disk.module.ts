import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { YaDiskService } from './ya-disk.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [YaDiskService],
})
export class YaDiskModule {
}
