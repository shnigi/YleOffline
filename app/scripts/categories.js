export function getCategory(category) {
  if (category === 'uutiset') {
    return '5-162';
  } else if (category === 'sarjat') {
    return '5-133';
  } else if (category === 'dokumentit') {
    return '5-149';
  } else if (category === 'urheilu') {
    return '5-228';
  } else if (category === 'elokuvat') {
    return '5-135';
  } else if (category === 'lapset') {
    return '5-195';
  } else if (category === 'historia') {
    return '5-222';
  } else {
    return 'error';
  }
};
