import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputSearch } from './input-search';

interface TestOption {
  code: string;
  name: string;
}

describe('InputSearch', () => {
  let component: InputSearch<TestOption>;
  let fixture: ComponentFixture<InputSearch<TestOption>>;

  const mockOptions: TestOption[] = [
    { code: '28', name: 'Normandie' },
    { code: '75', name: 'Nouvelle-Aquitaine' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearch]
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearch) as ComponentFixture<InputSearch<TestOption>>;
    component = fixture.componentInstance;

    fixture.componentRef.setInput('control', new FormControl(''));
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('displayWith', (item: TestOption) => item.name);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dropdown when open and has options', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    component.onFocus();

    expect(component.showDropdown()).toBe(true);
  });

  it('should emit selected on click', () => {
    let selectedItem: TestOption | undefined;
    component.selected.subscribe(item => selectedItem = item);

    component.selectOption(mockOptions[0]);

    expect(selectedItem).toEqual({ code: '28', name: 'Normandie' });
    expect(component.isOpen()).toBe(false);
  });

  it('should navigate with keyboard', () => {
    fixture.componentRef.setInput('options', mockOptions);
    component.onFocus();

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component.activeIndex()).toBe(0);

    let selectedItem: TestOption | undefined;
    component.selected.subscribe(item => selectedItem = item);
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(selectedItem).toEqual({ code: '28', name: 'Normandie' });
  });
});