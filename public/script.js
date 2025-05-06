const apiUrl = '/cars';

const carTableBody = document.querySelector('#carTable tbody');
const carForm = document.getElementById('carForm');
const messageDiv = document.getElementById('message');

// Modal elements
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModal');
const editCarForm = document.getElementById('editCarForm');

function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : '#388e3c';
    setTimeout(() => messageDiv.textContent = '', 2500);
}

function renderCars(cars) {
    carTableBody.innerHTML = '';
    cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${Array.isArray(car.colors) ? car.colors.join(', ') : ''}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${car._id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${car._id}">Delete</button>
            </td>
        `;
        carTableBody.appendChild(tr);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteCar(btn.dataset.id));
    });
}

function fetchCars() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(renderCars)
        .catch(() => showMessage('Failed to fetch cars', true));
}

carForm.addEventListener('submit', e => {
    e.preventDefault();
    const brand = document.getElementById('brand').value.trim();
    const model = document.getElementById('model').value.trim();
    const year = parseInt(document.getElementById('year').value, 10);
    const colors = document.getElementById('colors').value.split(',').map(c => c.trim()).filter(Boolean);

    if (!brand || !model || !year) {
        showMessage('Please fill in all required fields', true);
        return;
    }

    fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model, year, colors })
    })
    .then(res => res.json())
    .then(car => {
        if (car.error) {
            showMessage(car.error, true);
        } else {
            showMessage('Car added!');
            fetchCars();
            carForm.reset();
        }
    })
    .catch(() => showMessage('Failed to add car', true));
});

// Edit Modal Logic
function openEditModal(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(car => {
            document.getElementById('editId').value = car._id;
            document.getElementById('editBrand').value = car.brand;
            document.getElementById('editModel').value = car.model;
            document.getElementById('editYear').value = car.year;
            document.getElementById('editColors').value = Array.isArray(car.colors) ? car.colors.join(', ') : '';
            editModal.style.display = 'block';
        })
        .catch(() => showMessage('Failed to load car for editing', true));
}

closeModalBtn.onclick = function() {
    editModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
};

editCarForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const brand = document.getElementById('editBrand').value.trim();
    const model = document.getElementById('editModel').value.trim();
    const year = parseInt(document.getElementById('editYear').value, 10);
    const colors = document.getElementById('editColors').value.split(',').map(c => c.trim()).filter(Boolean);

    fetch(`${apiUrl}/findbyidupdate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model, year, colors })
    })
    .then(res => res.json())
    .then(car => {
        if (car.error) {
            showMessage(car.error, true);
        } else {
            showMessage('Car updated!');
            fetchCars();
            editModal.style.display = 'none';
        }
    })
    .catch(() => showMessage('Failed to update car', true));
});

// Delete Car
function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(result => {
        if (result.error) {
            showMessage(result.error, true);
        } else {
            showMessage('Car deleted!');
            fetchCars();
        }
    })
    .catch(() => showMessage('Failed to delete car', true));
}

// Initial fetch
fetchCars();