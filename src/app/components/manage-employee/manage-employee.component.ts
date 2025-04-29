import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    this.employeeService.getAllEmployees().subscribe((employees: Employee[]) => {
      this.employees = this.filterByDepartment(employees);
    });
  }

  onSubmit(): void {
    this.isEditing ? this.updateEmployee() : this.addEmployee();
  }

  addEmployee(): void {
    this.employeeService.createEmployee(this.employeeForm).subscribe({
      next: (newEmployee: Employee) => {
        this.employees.push(newEmployee);
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
        next: (updated: Employee) => {
          const idx = this.employees.findIndex(e => e.id === this.currentEmployeeId);
          this.employees[idx] = updated;
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
      return this.loadEmployees();
    }

    // First try by ID
    if (this.searchTerm) {
      this.employeeService.getEmployeeById(+this.searchTerm).subscribe({
        next: emp => this.display([emp], `Employee found by ID.`),
        error: () => this.searchByEmailOrShowNotFound()
      });
    } else {
      // No searchTerm, just filter by department
      this.loadEmployees();
    }
  }

  private searchByEmailOrShowNotFound(): void {
    this.employeeService.getEmployeeByEmail(this.searchTerm).subscribe({
      next: emp => this.display([emp], `Employee found by Email.`),
      error: () => this.display([], `Employee not found.`)
    });
  }

  private display(list: Employee[], message: string): void {
    this.employees = this.filterByDepartment(list);
    this.successMessage = list.length > 0 ? message : '';
    this.errorMessage = list.length === 0 ? message : '';
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
