// valores por defecto
$('.toolbar').toolbar({
  value: '16px',
  values: ['16px', '20px', '24px']
});


// callback
$('.toolbar').on('change.gl.toolbar', function (value) {
  console.log("Mis cambios");
});