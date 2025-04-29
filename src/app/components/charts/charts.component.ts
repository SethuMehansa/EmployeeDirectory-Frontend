import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/Employee';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule, HttpClientModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: 'bar' = 'bar';
  public barChartLabels = ['HR', 'IT', 'Finance', 'Operations'];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [0, 0, 0, 0], label: 'Employees per Dept' }
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [0, 0, 0, 0], label: 'Employees per Dept' }
    ]
  };
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((emps: Employee[]) => {
      const counts = { HR: 0, IT: 0, Finance: 0, Operations: 0 };
      emps.forEach(e => {
        const d = e.department as keyof typeof counts;
        if (counts[d] !== undefined) counts[d]++;
      });

      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          { data: [counts.HR, counts.IT, counts.Finance, counts.Operations], label: 'Employees per Dept' }
        ]
      };

      this.pieChartData = {
        labels: this.barChartLabels,
        datasets: [
          { data: [counts.HR, counts.IT, counts.Finance, counts.Operations], label: 'Employees per Dept' }
        ]
      };

      setTimeout(() => this.chart?.update(), 0);
    });
  }
}
