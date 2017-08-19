import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { routing } from './app.routes';

// modules
import { NgxAdminLteModule } from './ngx-admin-lte/ngx-admin-lte.module';
import { UiSwitchModule } from './ui-switch/ui-switch.module';
import { RestService } from './ngx-admin-lte/index';
import { IO } from 'rxjs-socket.io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2CompleterModule } from "ng2-completer";
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SensorComponent } from './pages/sensor/sensor.component';
import { LineComponent } from './pages/chart/line/line.component';
import { BarComponent } from './pages/chart/bar/bar.component';
import { DoughnutComponent } from './pages/chart/doughnut/doughnut.component';
import { RadarComponent } from './pages/chart/radar/radar.component';
import { ControlComponent } from './pages/control/control.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SensorComponent,
    LineComponent,
    BarComponent,
    DoughnutComponent,
    RadarComponent,
    ControlComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    Ng2CompleterModule,
    NgxAdminLteModule,
    UiSwitchModule,
    routing,
    BrowserAnimationsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, DatePipe, RestService, IO],
  bootstrap: [AppComponent
  ]
})
export class AppModule { }
