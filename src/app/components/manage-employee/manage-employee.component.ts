import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  imports: [CommonModule,FormsModule,HttpClientModule],
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employeeForm: Employee = new Employee('', '', '', undefined); 
  searchTerm: string = '';
  isEditing: boolean = false; 
  currentEmployeeId: number | null = null; 

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((employees:any) => {
      this.employees = employees;
    });
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  addEmployee(): void {
    this.employeeService.createEmployee(this.employeeForm).subscribe((newEmployee:any) => {
      this.employees.push(newEmployee);
      this.resetForm();
    });
  }

  updateEmployee(): void {
    if (this.currentEmployeeId) {
      this.employeeService
        .updateEmployee(this.currentEmployeeId, this.employeeForm)
        .subscribe((updatedEmployee:any) => {
          const index = this.employees.findIndex(
            (emp) => emp.id === this.currentEmployeeId
          );
          this.employees[index] = updatedEmployee;
          this.resetForm();
        });
    }
  }

  resetForm(): void {
    this.employeeForm = new Employee('', '', '', undefined); 
    this.isEditing = false;
    this.currentEmployeeId = null;
  }

  searchEmployee(): void {
    if (this.searchTerm) {
      this.employeeService.getEmployeeById(+this.searchTerm).subscribe(
        (employee:any) => {
          this.employees = [employee];
        },
        () => {
          this.employeeService.getEmployeeByEmail(this.searchTerm).subscribe(
            (employee:any) => {
              this.employees = [employee];
            },
            () => {
              this.employees = []; 
            }
          );
        }
      );
    } else {
      this.loadEmployees(); 
    }
  }

  editEmployee(employee: Employee): void {
    this.employeeForm = { ...employee }; 
    this.isEditing = true;
  }

  deleteEmployee(id: number | undefined): void {
    if (id !== undefined) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.employees = this.employees.filter((employee) => employee.id !== id);
      });
    } else {
      console.error("Employee ID is undefined");
    }
  }
  
}
