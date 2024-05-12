exports.getAllAircraft = async () => {
    const response = await fetch('http://localhost:5000/api/v1/aircraft');
    const data = await response.json();
    return data;
}

exports.getAircraftById = async (id) => {
    const response = await fetch(`http://localhost:5000/api/v1/aircraft/${id}`);
    const data = await response.json();
    return data;
}

exports.getStocksByAircraftId = async (id) => {
    const response = await fetch(`http://localhost:5000/api/v1/aircraft/stocks/${id}`);
    const data = await response.json();
    return data;
}

exports.deleteStockById = async (id) => {
    const response = await fetch(`http://localhost:5000/api/v1/stock/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}

exports.getStockDetailsById = async (id) => {
    const response = await fetch(`http://localhost:5000/api/v1/stock/${id}`);
    const data = await response.json();
    return data;
}