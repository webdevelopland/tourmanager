import { TestBed, async } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { BrowserModule, Title, By  } from "@angular/platform-browser";
import { HttpModule, JsonpModule, Http, ConnectionBackend, RequestOptions } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule, MatRadioModule, MatSelectModule, MatButtonModule } from "@angular/material";
import { HttpService } from "@/services/http.service";

describe('SearchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent
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
  it('should create SearchComponent', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should refresh vars', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const app = fixture.debugElement.componentInstance;
    app.refresh();
    expect(app.selectFrom).toEqual(null);
    expect(app.selectTo).toEqual(null);
    expect(app.radio).toEqual("radio-fast");
  });
  it('should search tours', async(() => {
    const fixture = TestBed.createComponent(SearchComponent);
    const app = fixture.debugElement.componentInstance;
    app.search();
    expect(app).toBeTruthy();
  }));
});
