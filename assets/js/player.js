// Playlist for the native <audio> player: click a track to play it, the
// current track is marked with aria-current, playback continues with the next
// track, and the left/right arrow keys skip between tracks.
document.addEventListener('DOMContentLoaded', function () {
  var player = document.querySelector('[data-player]');
  if (!player) return;

  var audio = player.querySelector('audio');
  var nowPlaying = player.querySelector('[data-now-playing]');
  var tracks = Array.prototype.slice.call(player.querySelectorAll('[data-src]'));
  var current = 0;

  function select(index, autoplay) {
    current = (index + tracks.length) % tracks.length;
    tracks.forEach(function (track, i) {
      track.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    audio.src = tracks[current].getAttribute('data-src');
    nowPlaying.textContent = tracks[current].getAttribute('data-title');
    if (autoplay) {
      var playing = audio.play();
      if (playing && playing.catch) playing.catch(function () {});
    }
  }

  tracks.forEach(function (track, i) {
    track.addEventListener('click', function () {
      select(i, true);
    });
  });

  audio.addEventListener('ended', function () {
    select(current + 1, true);
  });

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var target = e.target;
    if (target.closest && target.closest('input, textarea, select, audio, [contenteditable]')) return;
    if (e.key === 'ArrowRight') select(current + 1, true);
    else if (e.key === 'ArrowLeft') select(current - 1, true);
  });

  select(0, false);
});
