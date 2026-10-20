/**
 * Sacred Audio Player - Plays the authentic choral masterwork:
 * "For Unto Us a Child Is Born" from Handel's Messiah (HWV 56)
 * Performed by Choir and Orchestra.
 */

type AudioStateListener = (playing: boolean, progress: number) => void;

class SacredAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private listeners: Set<AudioStateListener> = new Set();
  private totalDuration = 258.4; // 04:18 duration of the Handel chorale
  private currentProgress = 0;
  private audioSources = [
    '/audio/for_unto_us_a_child_is_born.mp3',
    '/audio/for_unto_us_a_child_is_born.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Handel_-_messiah_-_12_for_unto_us_a_child_is_born.ogg',
  ];
  private currentSourceIndex = 0;

  constructor() {
    // Lazily setup audio on client side
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.src = this.audioSources[this.currentSourceIndex];

      // Time update listener
      this.audio.addEventListener('timeupdate', () => {
        if (!this.audio) return;
        const duration = this.audio.duration && !isNaN(this.audio.duration) && this.audio.duration > 0
          ? this.audio.duration
          : this.totalDuration;
        this.currentProgress = (this.audio.currentTime / duration) * 100;
        this.notifyListeners();
      });

      // Playback events
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.setupMediaSession();
        this.notifyListeners();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentProgress = 0;
        if (this.audio) this.audio.currentTime = 0;
        this.notifyListeners();
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
          this.totalDuration = this.audio.duration;
        }
      });

      // Error fallback to next source
      this.audio.addEventListener('error', () => {
        console.warn(`[SacredAudio] Source ${this.audioSources[this.currentSourceIndex]} failed, trying next fallback.`);
        if (this.currentSourceIndex < this.audioSources.length - 1) {
          this.currentSourceIndex++;
          if (this.audio) {
            const wasPlaying = this.isPlaying;
            this.audio.src = this.audioSources[this.currentSourceIndex];
            this.audio.load();
            if (wasPlaying) {
              this.audio.play().catch(() => {});
            }
          }
        }
      });
    } catch (err) {
      console.warn('[SacredAudio] Audio initialization warning:', err);
    }
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'For Unto Us a Child Is Born',
          artist: 'Handel - Messiah (Choir & Orchestra)',
          album: 'St Cletus Choir Christmas Concert 2026',
          artwork: [
            {
              src: 'https://images.unsplash.com/photo-1548625361-195feeed155e?auto=format&fit=crop&w=512&q=80',
              sizes: '512x512',
              type: 'image/jpeg',
            },
          ],
        });
      } catch {
        // Ignored
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.isPlaying, this.currentProgress);
      } catch (err) {
        console.error('[SacredAudio] Listener error:', err);
      }
    });
  }

  /**
   * Register a subscriber listener. All components remain synchronized.
   */
  public init(callback?: AudioStateListener): () => void {
    if (callback) {
      this.listeners.add(callback);
      // Immediately report initial state
      callback(this.isPlaying, this.currentProgress);
    }
    return () => {
      if (callback) {
        this.listeners.delete(callback);
      }
    };
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.initAudioElement();
    if (!this.audio) return;
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notifyListeners();
        })
        .catch((error) => {
          console.warn('[SacredAudio] Play prevented or failed:', error);
          this.isPlaying = false;
          this.notifyListeners();
        });
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notifyListeners();
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.currentProgress = 0;
    this.notifyListeners();
  }

  public seekToPercent(percent: number) {
    if (!this.audio) return;
    const clampedPercent = Math.max(0, Math.min(100, percent));
    const duration = this.audio.duration && !isNaN(this.audio.duration) && this.audio.duration > 0
      ? this.audio.duration
      : this.totalDuration;
    const targetSeconds = (clampedPercent / 100) * duration;
    this.audio.currentTime = targetSeconds;
    this.currentProgress = clampedPercent;
    this.notifyListeners();
  }

  public getCurrentTimeFormatted(): string {
    const currentSecs = this.audio ? Math.floor(this.audio.currentTime || 0) : 0;
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public getTotalDurationFormatted(): string {
    const totalSecs = this.audio && this.audio.duration && !isNaN(this.audio.duration)
      ? Math.floor(this.audio.duration)
      : Math.floor(this.totalDuration);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const sacredAudio = new SacredAudioPlayer();
