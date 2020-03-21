window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    Castify.initializeCastApi();
  }
};

var castSession;

var Castify = {
  albumdata: null,
  log: (...msgs) => {
    console.log("[Castify]", ...msgs);
  },
  getTrackInfo: _ => {
    return Castify.albumdata.trackinfo[0];
  },
  getAudioURLS: _ => {
    return Castify.getTrackInfo().file["mp3-128"];
  },
  handleSessionChange: function(e) {
    if (e.sessionState === cast.framework.SessionState.SESSION_STARTED) {
      Castify.sendAudio();
    }
  },
  sendAudio: _ => {
    castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    var mediaInfo = new chrome.cast.media.MediaInfo(Castify.getAudioURLS(), "audio/mpeg");
    mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    mediaInfo.metadata.artist = Castify.albumdata.artist;
    mediaInfo.metadata.images = [new chrome.cast.Image("https://f4.bcbits.com/img/a"+Castify.albumdata.art_id+"_16.jpg")];
    mediaInfo.metadata.title = Castify.getTrackInfo().title;

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    castSession.loadMedia(request).then(
      function() { Castify.log('Load succeed'); },
      function(errorCode) { Castify.log('Error code: ' + errorCode); });
  },
  initializeCastApi: _ => {
    Castify.albumdata = TralbumData;

    var context = cast.framework.CastContext.getInstance();
    context.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    });

    document.querySelector(".inline_player").insertAdjacentHTML('beforeend', '<style>google-cast-launcher { width: 30px; display: inline-block; }</style><google-cast-launcher></google-cast-launcher>');

    context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, Castify.handleSessionChange);
  }
};
