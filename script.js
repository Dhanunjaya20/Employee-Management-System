document.addEventListener("DOMContentLoaded", () => {
  const employeeForm = document.getElementById("employeeForm");
  const employeeList = document.getElementById("employeeList");

  const baseURL = "https://employee-management-system-2-cis4.onrender.com";

  // Ask if user is the admin
  const isAdmin = confirm("Are you the admin? Click OK if yes.");

  // Load employees (for everyone)
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
            ${isAdmin ? `<td><button class="deleteBtn" data-id="${employee.id}">Delete</button></td>` : "<td></td>"}
          `;
          employeeList.appendChild(row);
        });

        // Add delete buttons if admin
        if (isAdmin) {
          document.querySelectorAll(".deleteBtn").forEach(button => {
            button.addEventListener("click", () => {
              const id = button.getAttribute("data-id");
              deleteEmployee(id);
            });
          });
        }
      })
      .catch(err => console.error("Error loading employees:", err));
  }

  // Delete employee (admin only)
  function deleteEmployee(id) {
    fetch(`${baseURL}/employees/${id}`, {
      method: "DELETE"
    })
      .then(() => loadEmployees())
      .catch(err => console.error("Error deleting employee:", err));
  }

  // Form submit (open to everyone)
  employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;

    const employee = { name, role, department, salary };

    fetch(`${baseURL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    })
      .then(() => {
        employeeForm.reset();
        loadEmployees(); // reload list after adding
      })
      .catch(err => console.error("Add error:", err));
  });

  // Load employees on page load
  loadEmployees();
});
