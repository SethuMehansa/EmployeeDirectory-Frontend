export class Employee {
    id?: number;
    name: string;
    email: string;
    department: string;
    createdAt?: Date;
    updatedAt?: Date;
  
    constructor(
      name: string,
      email: string,
      department: string,
      id?: number,
      createdAt?: Date,
      updatedAt?: Date
    ) {
      this.name = name;
      this.email = email;
      this.department = department;
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  