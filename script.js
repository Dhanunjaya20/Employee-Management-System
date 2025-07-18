document.addEventListener("DOMContentLoaded", () => {
  const employeeForm = document.getElementById("employeeForm");
  const employeeList = document.getElementById("employeeList");
// Only show employee list if you're the admin
const isAdmin = confirm("Are you an admin? Click OK if yes, Cancel if you're just submitting a form.");

  const baseURL = "https://employee-management-system-2-cis4.onrender.com";

  // Load all employees
  function loadEmployees() {
    fetch(`${baseURL}/employees`)
      .then(res => res.json())
      .then(data => {
        employeeList.innerHTML = "";
        data.forEach(employee => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.role}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td><button class="deleteBtn" data-id="${employee.id}">Delete</button></td>
          `;
          employeeList.appendChild(row);
        });
if (isAdmin) {
        const deleteButtons = document.querySelectorAll(".deleteBtn");
        deleteButtons.forEach(button => {
          button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            deleteEmployee(id);
          });
        });
      }
    })
    .catch(err => console.error("Load error:", err));
}
        // Add delete button events
        const deleteButtons = document.querySelectorAll(".deleteBtn");
        deleteButtons.forEach(button => {
          button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            deleteEmployee(id);
          });
        });
      })
      .catch(err => console.error("Error loading employees:", err));
  }

  // Delete an employee
  function deleteEmployee(id) {
    fetch(`${baseURL}/employees/${id}`, {
      method: "DELETE"
    })
      .then(() => loadEmployees())
      .catch(err => console.error("Error deleting employee:", err));
  }

  // Add new employee
  employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = parseFloat(document.getElementById("salary").value);

    if (!name || !role || !department || isNaN(salary)) {
      alert("Please fill all fields correctly.");
      return;
    }

    const employee = { name, role, department, salary };

    fetch(`${baseURL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    })
      .then(() => {
        employeeForm.reset();
        loadEmployees();
      })
      .catch(err => console.error("Error adding employee:", err));
  });

  // Initial load
  loadEmployees();
});
