(function () {
  // Load clinic data and inject into all elements with data-clinic attribute
  fetch('data/clinic.json')
    .then(function (r) { return r.json(); })
    .then(function (clinic) {
      document.querySelectorAll('[data-clinic]').forEach(function (el) {
        var key = el.getAttribute('data-clinic');
        if (clinic[key] === undefined) return;
        el.textContent = clinic[key];
        // Auto-set href for link elements
        if (el.tagName === 'A') {
          if (key === 'phone') el.href = 'tel:' + clinic[key].replace(/[^+\d]/g, '');
          if (key === 'email' || key === 'adviceEmail') el.href = 'mailto:' + clinic[key];
        }
      });
    });

  // Load urologists on about page
  var grid = document.getElementById('urologists-grid');
  if (grid) {
    fetch('data/urologists.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        grid.innerHTML = data.urologists.map(function (doc) {
          // Get initials for avatar
          var initials = doc.name.replace(/^Dr\.\s*/, '').split(' ').map(function (w) { return w[0]; }).join('');
          var html = '<div class="border border-gray-200 rounded-lg p-4 md:p-6 hover:border-brand-300 hover:shadow-sm transition-all">';
          html += '<div class="flex items-center gap-3 mb-3">';
          if (doc.image) {
            html += '<img src="' + escapeHtml(doc.image) + '" alt="' + escapeHtml(doc.name) + '" class="w-14 h-14 rounded-full object-cover shrink-0"/>';
          } else {
            html += '<div class="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold shrink-0" style="font-family:system-ui,-apple-system,sans-serif;">' + escapeHtml(initials) + '</div>';
          }
          html += '<div>';
          html += '<h3 class="text-base md:text-lg font-bold text-gray-800" style="font-family:system-ui,-apple-system,sans-serif;">' + escapeHtml(doc.name) + '</h3>';
          html += '<p class="text-brand-700 text-sm font-medium">' + escapeHtml(doc.title) + '</p>';
          html += '</div></div>';
          if (doc.credentials) {
            html += '<p class="text-xs text-gray-500 mb-2">' + escapeHtml(doc.credentials) + '</p>';
          }
          html += '<p class="text-xs text-brand-600 font-medium mb-2">' + escapeHtml(doc.specialization) + '</p>';
          html += '<p class="text-sm text-gray-700 leading-relaxed" style="font-family:Georgia,serif;">' + escapeHtml(doc.bio) + '</p>';
          html += '</div>';
          return html;
        }).join('');
      });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
