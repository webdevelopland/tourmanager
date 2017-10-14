import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HttpModule, JsonpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// —————————————————————— Material ——————————————————————
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule } from "@angular/material";
import "hammerjs";

// —————————————————————— Components ——————————————————————
import { AngularComponent } from "@/components/angular/angular.component";
import { NavComponent } from "@/components/nav/nav.component";
import { ResultsComponent } from "@/routes/home/results/results.component";
import { SearchComponent } from "@/routes/home/search/search.component";

// —————————————————————— Routes ——————————————————————
import { HomePageComponent } from "@/routes/home/home.component";
import { Error404PageComponent } from "@/routes/error404/error404.component";

const appRoutes: Routes = [
  { path: "",         component: HomePageComponent },
  { path: "**",       component: Error404PageComponent }
];

// —————————————————————— Servies ——————————————————————
import { HttpService } from "@/services/http.service";

// ———————————————————————————————— NgModule ————————————————————————————————
@NgModule({
  declarations: [
    // Components
    AngularComponent,
    NavComponent,
    ResultsComponent,
    SearchComponent,

    // Routes:
    HomePageComponent,
    Error404PageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule, JsonpModule,
    FormsModule, ReactiveFormsModule,

    // Angular Material:
    BrowserAnimationsModule,
    MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule,

    // Router:
    RouterModule.forRoot(appRoutes, { useHash: false })
  ],
  providers: [
    Title,
    HttpService
  ],
  bootstrap: [ AngularComponent ]
})
export class AngularModule {}
