import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employeeForm: Employee = new Employee('', '', '', undefined);
  searchTerm: string = '';
  selectedDepartment: string = '';
  isEditing: boolean = false;
  currentEmployeeId: number | null = null;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((emps: Employee[]) => {
      this.employees = this.filterByDepartment(emps);
    });
  }

  onSubmit(): void {
    this.isEditing ? this.updateEmployee() : this.addEmployee();
  }

  addEmployee(): void {
    this.employeeService.createEmployee(this.employeeForm).subscribe({
      next: (newEmp: Employee) => {
        this.employees.push(newEmp);
        this.success('Employee added successfully.');
        this.resetForm();
      },
      error: () => this.error('Failed to add employee.')
    });
  }

  updateEmployee(): void {
    if (!this.currentEmployeeId) return;
    this.employeeService
      .updateEmployee(this.currentEmployeeId, this.employeeForm)
      .subscribe({
        next: (upd: Employee) => {
          const idx = this.employees.findIndex(e => e.id === this.currentEmployeeId);
          if (idx > -1) this.employees[idx] = upd;
          this.success('Employee updated successfully.');
          this.resetForm();
        },
        error: () => this.error('Failed to update employee.')
      });
  }

  resetForm(): void {
    this.employeeForm = new Employee('', '', '', undefined);
    this.isEditing = false;
    this.currentEmployeeId = null;
  }

  searchEmployee(): void {
    if (!this.searchTerm && !this.selectedDepartment) {
      this.loadEmployees();
      return;
    }

    if (this.searchTerm) {
      this.employeeService.getEmployeeById(+this.searchTerm).subscribe({
        next: emp => this.display([emp]),
        error: () => this.searchByEmailOrNotFound()
      });
    } else {
      this.loadEmployees();
    }
  }

  private searchByEmailOrNotFound(): void {
    this.employeeService.getEmployeeByEmail(this.searchTerm).subscribe({
      next: emp => this.display([emp]),
      error: () => {
        this.employees = [];
        this.error('Employee not found.');
      }
    });
  }

  private display(list: Employee[]): void {
    this.employees = this.filterByDepartment(list);
    this.clearMessagesAfterDelay();
  }

  private filterByDepartment(list: Employee[]): Employee[] {
    return this.selectedDepartment
      ? list.filter(emp => emp.department === this.selectedDepartment)
      : list;
  }

  editEmployee(emp: Employee): void {
    this.employeeForm = { ...emp };
    this.isEditing = true;
    this.currentEmployeeId = emp.id ?? null;
  }

  deleteEmployee(id: number | undefined): void {
    if (id == null) {
      this.error('Employee ID is undefined');
      return;
    }
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
        this.success('Employee deleted successfully.');
      },
      error: () => this.error('Failed to delete employee.')
    });
  }

  downloadCsv(): void {
    this.employeeService.exportCsv().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'employees.csv');
      },
      error: () => this.error('Failed to download CSV.')
    });
  }

  private success(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    this.clearMessagesAfterDelay();
  }

  private error(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
    this.clearMessagesAfterDelay();
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
