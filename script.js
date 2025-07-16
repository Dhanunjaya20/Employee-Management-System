document.addEventListener("DOMContentLoaded", () => {
  const employeeForm = document.getElementById("employeeForm");
  const employeeList = document.getElementById("employeeList");

  // ✅ Function to load all employees
  function loadEmployees() {
    fetch("http://localhost:3000/employees")
      .then(res => res.json())
      .then(data => {
        employeeList.innerHTML = ""; // clear previous
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

        // ✅ Add event listeners to all Delete buttons
        const deleteButtons = document.querySelectorAll(".deleteBtn");
        deleteButtons.forEach(button => {
          button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            deleteEmployee(id);
          });
        });
      });
  }

  // ✅ Function to delete employee
  function deleteEmployee(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
      method: "DELETE"
    })
      .then(() => loadEmployees()) // reload list
      .catch(err => console.error("Delete error:", err));
  }

  // ✅ Handle Add Employee form
  employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;

    const employee = {
      name,
      role,
      department,
      salary
    };

    fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employee)
    })
      .then(() => {
        employeeForm.reset();
        loadEmployees();
      })
      .catch(err => console.error("Add error:", err));
  });

  // Initial load
  loadEmployees();
});
