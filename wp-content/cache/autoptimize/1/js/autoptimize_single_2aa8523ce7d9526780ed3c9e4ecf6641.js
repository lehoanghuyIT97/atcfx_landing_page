function initializeSignaturePad(wrapper, $scope, $) {
  let wrapper_inner = wrapper.querySelector('.gloo-signature-canvas-inner_wrapper');
  let clearButton = wrapper.querySelector('[data-action=clear]');
  let changeColorButton = wrapper.querySelector('[data-action=change-color]');
  let hiddenInput = wrapper.querySelector('input');
  let canvas = wrapper.querySelector('canvas');
  let canvas_actual_size = getComputedStyle(wrapper_inner);
  let canvas_width = parseInt(canvas_actual_size.getPropertyValue('width'), 10);
  let canvas_height = parseInt(canvas_actual_size.getPropertyValue('height'), 10);
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  let signaturePad = new SignaturePad(canvas, {
    penColor: canvas.getAttribute('data-pen-color'),
    backgroundColor: canvas.getAttribute('data-background-color'),
  });
  let useJPEG = canvas.getAttribute('data-jpeg') === 'yes',
    $button = $scope.find('.elementor-field-type-submit button');
  const updateValue = () => {
    if (!signaturePad.isEmpty()) {
      hiddenInput.value = signaturePad.toDataURL('image/' + (useJPEG ? 'jpeg' : 'png'));
    }
  };
  $button.on('click', () => updateValue());
  $(canvas).on('mouseup touchend', () => updateValue());
  let context = canvas.getContext('2d');
  clearButton.addEventListener('click', function (event) {
    context.fillStyle = canvas.getAttribute('data-background-color');
    context.fillRect(0, 0, canvas.width, canvas.height);
    signaturePad.clear();
    hiddenInput.value = '';
  });
  window.addEventListener('resize', function (event) {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    signaturePad.clear();
    hiddenInput.value = '';
  });
}
var WidgetElements_FormSignature = function ($scope, $) {
  let wrappers = $scope.find('.gloo-signature-wrapper');
  wrappers.each((_, w) => initializeSignaturePad(w, $scope, $));
};
jQuery(window).on('elementor/frontend/init', function () {
  elementorFrontend.hooks.addAction('frontend/element_ready/form.default', WidgetElements_FormSignature);
});
