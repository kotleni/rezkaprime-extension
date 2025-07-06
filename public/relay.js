try {
  if (typeof CDNPlayerInfo !== 'undefined') {
    window.postMessage({
      type: 'CDN_PLAYER_INFO_INSTANCE',
      payload: CDNPlayerInfo
    }, '*');
  }
} catch (e) {
  // TODO
}