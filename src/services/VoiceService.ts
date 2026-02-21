'use client';

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

// Add to window object
declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

export interface VoiceSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  autoSpeak: boolean;
  preferredVoice: string;
  language: string;
  useSarvamAI: boolean;
}

export interface VoiceServiceInterface {
  isSupported(): {
    speechSynthesis: boolean;
    speechRecognition: boolean;
  };
  speakText(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: unknown) => void;
  }): Promise<void>;
  stopSpeaking(): void;
  startListening(options: {
    onResult: (transcript: string) => void;
    onInterimResult?: (transcript: string) => void;
    onError?: (error: Error | SpeechRecognitionErrorEvent) => void;
    onEnd?: () => void;
    onStart?: () => void;
  }): void;
  stopListening(): void;
  getSettings(): VoiceSettings;
  updateSettings(settings: Partial<VoiceSettings>): void;
  getVoices(): SpeechSynthesisVoice[];
  setVoice(voiceNameOrIndex: string | number): void;
  getState(): { isListening: boolean; isSpeaking: boolean; currentVoice: string; voicesAvailable: number; settings: Record<string, unknown> };
  testTTS(): Promise<boolean>;
  reinitialize(): void;
  enableDebugMode(): void;
  ensureReady(): Promise<boolean>;
}

export class VoiceService implements VoiceServiceInterface {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: SpeechRecognition | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private debugMode: boolean = false;
  private initialized: boolean = false;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  // Sarvam AI Configuration
  private sarvamApiKey: string = '';
  private sarvamSpeaker: string = 'amelia'; // Natural English voice
  private sarvamModel: string = 'bulbul:v3';
  private sarvamLanguage: string = 'en-IN';

  private settings: VoiceSettings = {
    speechRate: 1.0,
    speechPitch: 1.0,
    speechVolume: 1.0,
    autoSpeak: true,
    preferredVoice: 'Google हिन्दी', // Default fallback for Web Speech API
    language: 'en-IN',
    useSarvamAI: true // Enable Sarvam AI voice
  };

  constructor() {
    if (typeof window !== 'undefined') {
      // Load environment variables from Next.js public runtime config
      this.sarvamApiKey = process.env.NEXT_PUBLIC_SARVAM_API_KEY || '';
      this.sarvamSpeaker = (process.env.NEXT_PUBLIC_SARVAM_SPEAKER || 'amelia').toLowerCase();
      
      console.log('🔑 Sarvam AI API Key loaded:', this.sarvamApiKey ? `${this.sarvamApiKey.substring(0, 8)}...` : 'NOT SET');
      console.log('🎤 Sarvam AI Speaker:', this.sarvamSpeaker);
      
      this.initialize();
    }
  }

  private initialize() {
    if (this.initialized) return;

    try {
      if (typeof window !== 'undefined') {
        // Initialize Web Speech API
        if (window.speechSynthesis) {
          this.synthesis = window.speechSynthesis;
          this.loadVoices();
          window.speechSynthesis.onvoiceschanged = () => {
            this.loadVoices();
          };
        }

        // Initialize Audio Context for Sarvam AI TTS (use safe typed constructor for vendor prefixes)
        type AudioContextConstructor = new (contextOptions?: AudioContextOptions) => AudioContext;
        const win = window as unknown as { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor };
        const AudioCtxClass = win.AudioContext || win.webkitAudioContext;
        if (AudioCtxClass) {
          this.audioContext = new AudioCtxClass();
        }
      }

      this.initializeSpeechRecognition();
      this.initialized = true;
      this.log('Voice service initialized');
    } catch (error) {
      console.error('Failed to initialize voice service:', error);
    }
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.settings.language;
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;

    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      this.voices = voices;
      this.log(`Loaded ${voices.length} voices`);
      this.selectBestVoice();
    }
  }

  private selectBestVoice() {
    if (this.voices.length === 0) return;

    let selectedVoice = this.voices.find(v => v.name === this.settings.preferredVoice);

    if (!selectedVoice) {
      const indianVoices = this.voices.filter(v =>
        v.lang.includes('IN') ||
        v.lang.includes('hi') ||
        v.name.includes('India') ||
        v.name.includes('Hindi')
      );

      if (indianVoices.length > 0) {
        selectedVoice = indianVoices.find(v => v.name.includes('Google')) || indianVoices[0];
      }
    }

    if (!selectedVoice) {
      selectedVoice = this.voices.find(v => v.lang.startsWith('en'));
    }

    if (!selectedVoice) {
      selectedVoice = this.voices[0];
    }

    if (selectedVoice && selectedVoice.name !== this.settings.preferredVoice) {
      this.log(`Selected fallback voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    }
  }

  public isSupported() {
    return {
      speechSynthesis: typeof window !== 'undefined' && !!window.speechSynthesis,
      speechRecognition: typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    };
  }

  public async ensureReady(): Promise<boolean> {
    if (!this.initialized) {
      this.initialize();
    }

    // Resume AudioContext if suspended (browser policy)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.log('✅ AudioContext resumed');
      } catch (error) {
        console.warn('⚠️ Failed to resume AudioContext:', error);
      }
    }

    // Test speech synthesis with user interaction
    if (this.synthesis) {
      try {
        // Try to speak an empty utterance to "unlock" speech synthesis
        const testUtterance = new SpeechSynthesisUtterance('');
        this.synthesis.speak(testUtterance);
        this.synthesis.cancel();
        this.log('✅ Speech synthesis unlocked');
      } catch (error) {
        console.warn('⚠️ Speech synthesis test failed:', error);
      }
    }

    if (this.voices.length === 0 && this.synthesis) {
      return new Promise((resolve) => {
        let attempts = 0;
        const checkVoices = setInterval(() => {
          this.loadVoices();
          if (this.voices.length > 0 || attempts > 10) {
            clearInterval(checkVoices);
            resolve(this.voices.length > 0);
          }
          attempts++;
        }, 100);
      });
    }

    return true;
  }

  private async speakWithSarvamAI(text: string, options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: unknown) => void;
  }): Promise<void> {
    if (!this.sarvamApiKey) {
      throw new Error('Sarvam AI API key not configured');
    }

    try {
      // Truncate text to Sarvam limit (1500 chars for v2, 2500 for v3)
      const maxLen = this.sarvamModel === 'bulbul:v3' ? 2500 : 1500;
      const truncatedText = text.length > maxLen ? text.substring(0, maxLen) : text;

      this.log(`🔊 Generating Sarvam AI audio with speaker: ${this.sarvamSpeaker}`);
      this.log(`API Key present: ${this.sarvamApiKey ? 'Yes' : 'No'}`);
      options?.onStart?.();
      this.isSpeaking = true;

      const requestBody: Record<string, unknown> = {
        inputs: [truncatedText],
        target_language_code: this.sarvamLanguage,
        speaker: this.sarvamSpeaker,
        model: this.sarvamModel,
        pace: this.settings.speechRate,
        speech_sample_rate: 22050,
        enable_preprocessing: true
      };

      if (this.sarvamModel !== 'bulbul:v3') {
        requestBody.pitch = this.settings.speechPitch - 1; // Sarvam range: -0.75 to 0.75, our default is 1.0
        requestBody.loudness = this.settings.speechVolume;
      }

      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': this.sarvamApiKey
        },
        body: JSON.stringify(requestBody)
      });

      this.log(`Sarvam AI response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Sarvam AI API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      if (!data.audios || data.audios.length === 0) {
        throw new Error('No audio returned from Sarvam AI');
      }

      // Decode base64 WAV audio
      const base64Audio = data.audios[0];
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;

      // Stop any currently playing audio from both sources
      this.stopSpeaking();

      if (!this.audioContext) {
        type AudioContextConstructor = new (contextOptions?: AudioContextOptions) => AudioContext;
        const win = window as unknown as { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor };
        const AudioCtxClass = win.AudioContext || win.webkitAudioContext;
        if (AudioCtxClass) {
          this.audioContext = new AudioCtxClass();
        }
      }

      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext!.destination);

      this.currentSource = source;
      this.isSpeaking = true;

      source.onended = () => {
        this.isSpeaking = false;
        this.currentSource = null;
        this.log('✅ Sarvam AI playback finished');
        options?.onEnd?.();
      };

      source.start(0);
      this.log('▶️ Sarvam AI playback started');

    } catch (error) {
      console.error('Sarvam AI TTS error:', error);
      this.isSpeaking = false;
      options?.onError?.(error);
      throw error; // Re-throw to trigger fallback
    }
  }

  public async speakText(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: unknown) => void;
  }): Promise<void> {
    if (!this.settings.autoSpeak) {
      this.log('🔇 Auto-speak disabled, skipping TTS');
      return;
    }

    // Try Sarvam AI first if enabled
    if (this.settings.useSarvamAI && this.sarvamApiKey) {
      try {
        this.log('🎙️ Attempting Sarvam AI TTS...');
        await this.speakWithSarvamAI(text, options);
        this.log('✅ Sarvam AI TTS succeeded');
        return;
      } catch (error) {
        console.warn('⚠️ Sarvam AI failed, falling back to Web Speech API', error);
        this.log(`Sarvam AI error details: ${error instanceof Error ? error.message : String(error)}`);
        // Fall through to Web Speech API
      }
    }

    // Fallback to Web Speech API
    return new Promise((resolve, reject) => {
      this.log('🔊 Attempting Web Speech API:', text.substring(0, 100) + '...');

      if (!this.synthesis) {
        console.error('❌ Speech synthesis not supported');
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const timeoutId = setTimeout(() => {
        console.error('⏰ TTS timeout after 30 seconds');
        this.isSpeaking = false;
        reject(new Error('TTS timeout'));
      }, 30000);

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || this.settings.speechRate;
      utterance.pitch = options?.pitch || this.settings.speechPitch;
      utterance.volume = options?.volume || this.settings.speechVolume;

      let voice = this.voices.find(v => v.name === this.settings.preferredVoice);
      if (!voice) {
        // Fallback logic for Indian English
        const indianVoices = this.voices.filter(v =>
          v.lang.includes('IN') || v.lang.includes('hi') || v.name.includes('India')
        );
        voice = indianVoices[0] || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
      }

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      utterance.onstart = () => {
        this.log('▶️ TTS Started');
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.log('✅ TTS Finished');
        clearTimeout(timeoutId);
        this.isSpeaking = false;
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('❌ TTS Error:', event);
        clearTimeout(timeoutId);
        this.isSpeaking = false;
        
        // Handle 'not-allowed' error specifically
        if (event.error === 'not-allowed') {
          console.warn('⚠️ Speech synthesis blocked by browser. User interaction required.');
          // Try to unlock by calling ensureReady on next user interaction
        }
        
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve();
        } else {
          options?.onError?.(event);
          reject(event);
        }
      };

      this.synthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    // Stop Web Speech API
    if (this.synthesis) {
      this.synthesis.cancel();
    }

    // Stop Sarvam AI Audio
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }

    this.isSpeaking = false;
  }

  public startListening(options: {
    onResult: (transcript: string) => void;
    onInterimResult?: (transcript: string) => void;
    onError?: (error: Error | SpeechRecognitionErrorEvent) => void;
    onEnd?: () => void;
    onStart?: () => void;
  }) {
    if (!this.recognition) {
      options.onError?.(new Error('Speech recognition not supported'));
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.lang = this.settings.language;
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.log('🎤 Listening started');
        this.isListening = true;
        options.onStart?.();
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          this.log('📝 Final result:', finalTranscript);
          options.onResult(finalTranscript);
        }

        if (interimTranscript && options.onInterimResult) {
          options.onInterimResult(interimTranscript);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.log('❌ Recognition error:', event.error);
        if (event.error !== 'no-speech') {
          this.isListening = false;
        }
        options.onError?.(event);
      };

      this.recognition.onend = () => {
        this.log('🛑 Listening ended');
        this.isListening = false;
        options.onEnd?.();
      };

      this.recognition.start();
    } catch (error) {
      console.error('Failed to start listening:', error);
      options.onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (newSettings.language && this.recognition) {
      this.recognition.lang = newSettings.language;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('voiceSettings', JSON.stringify(this.settings));
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voiceName: string) {
    this.updateSettings({ preferredVoice: voiceName });
  }

  public getState() {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      currentVoice: this.settings.preferredVoice,
      voicesAvailable: this.voices.length,
      settings: this.settings as unknown as Record<string, unknown>
    };
  }

  public async testTTS(): Promise<boolean> {
    try {
      await this.speakText('Hello! This is a test of the voice system.', {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      });
      return true;
    } catch (error) {
      console.error('TTS Test failed:', error);
      return false;
    }
  }

  public reinitialize() {
    this.initialized = false;
    this.initialize();
  }

  public enableDebugMode() {
    this.debugMode = true;
  }

  private log(...args: unknown[]) {
    if (this.debugMode) {
      console.log('[VoiceService]', ...args);
    }
  }
}

export const voiceService = new VoiceService();