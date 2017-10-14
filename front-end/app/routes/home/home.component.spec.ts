import { TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home.component';
import { BrowserModule, Title } from "@angular/platform-browser";
import { HttpModule, JsonpModule, Http, ConnectionBackend, RequestOptions } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule } from "@angular/material";
import { HttpService } from "@/services/http.service";

describe('HomePageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent
      ],
      imports: [
        BrowserModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule
      ]
    }).compileComponents();
  });
  it('HomePageComponent', () => {
    expect("component").toEqual("component");
  });
});
