// Assemble obfuscated contact email links (see _includes/email.html).
// Clicking a link copies the address to the clipboard instead of opening a mail client.
$('a.obfuscated-email').each(function() {
    var reverse = function(s) { return String(s).split('').reverse().join(''); };
    var address = reverse($(this).attr('data-u')) + '@' + reverse($(this).attr('data-d'));
    $(this).attr({ href: '#', 'aria-label': 'Copy email address' }).data('address', address);
    if (!$(this).attr('data-keep-text')) {
        $(this).text(address);
    }
});

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for browsers without the async clipboard API
    var $tmp = $('<textarea>').val(text).css({ position: 'fixed', opacity: 0 }).appendTo('body');
    $tmp[0].select();
    var ok = document.execCommand('copy');
    $tmp.remove();
    return ok ? $.Deferred().resolve().promise() : $.Deferred().reject().promise();
}

$('a.obfuscated-email').on('click', function(event) {
    event.preventDefault();
    var $link = $(this);
    var address = $link.data('address');
    var showTip = function(message) {
        $link.tooltip('destroy');
        $link.tooltip({ title: message, trigger: 'manual', placement: 'top', container: 'body' }).tooltip('show');
        clearTimeout($link.data('tipTimer'));
        $link.data('tipTimer', setTimeout(function() { $link.tooltip('destroy'); }, 1500));
    };
    $.when(copyText(address)).then(
        function() { showTip('Copied!'); },
        function() { showTip(address); }
    );
});
