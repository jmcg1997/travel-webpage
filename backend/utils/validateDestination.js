// Validate destination input data and return an array of errors (if any)
export default function validateDestinationInput(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push("Invalid data format.");
    return errors;
  }

  // Name must be at least 3 characters
  if (!data.name || data.name.trim().length < 3) {
    errors.push("Name must be at least 3 characters.");
  }

  // Country must contain only letters and spaces
  const country = data.country?.trim();
  const countryRegex = /^[a-zA-Z\s]+$/;
  if (!country || !countryRegex.test(country)) {
    errors.push("Country must contain only letters.");
  }

  // Coordinates (if provided) must be valid latitude and longitude
  const lat = data.coordinates?.lat;
  const lng = data.coordinates?.lng;

  if (lat !== undefined || lng !== undefined) {
    if (
      typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90 ||
      typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180
    ) {
      errors.push("If provided, coordinates must be valid latitude (-90 to 90) and longitude (-180 to 180).");
    }
  }

  // Category (optional) must be a string
  if (data.category && typeof data.category !== 'string') {
    errors.push("Category must be a string.");
  }

  // Status (optional) must be either 'wishlist' or 'visited'
  if (data.status && !['wishlist', 'visited'].includes(data.status)) {
    errors.push('Status must be either "wishlist" or "visited".');
  }

  // Tags (optional) must be an array of strings
  if (data.tags && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string'))) {
    errors.push("Tags must be an array of strings.");
  }

  return errors;
}
