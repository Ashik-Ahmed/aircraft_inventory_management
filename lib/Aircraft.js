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