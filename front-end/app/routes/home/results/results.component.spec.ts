import { TestBed, async } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { BrowserModule, Title } from "@angular/platform-browser";
import { HttpModule, JsonpModule, Http, ConnectionBackend, RequestOptions } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule } from "@angular/material";
import { HttpService } from "@/services/http.service";

describe('ResultsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResultsComponent
      ],
      imports: [
        BrowserModule,
        HttpModule, JsonpModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule
      ],
      providers: [
        HttpService
      ]
    }).compileComponents();
  });
  it('should create ResultsComponent', () => {
    const fixture = TestBed.createComponent(ResultsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should show results', async(() => {
    const fixture = TestBed.createComponent(ResultsComponent);
    const app = fixture.debugElement.componentInstance;
    var routing = {
      min: 300,
      price: 100,
      route: [{
        from: "London",
        to: "Paris",
        price: "100",
        transport: "car",
        code: "xx",
        min: 100
      }]
    };
    app.show(routing);
    expect(app.visible).toEqual(true);
    expect(app.route.length).toEqual(1);
  }));
  it('should hide results', async(() => {
    const fixture = TestBed.createComponent(ResultsComponent);
    const app = fixture.debugElement.componentInstance;
    app.visible = true;
    app.reset();
    expect(app.visible).toEqual(false);
  }));
});
