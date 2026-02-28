import BraveSearchInterface from './BraveSearchInterface';
import HimalayaInterface from './HimalayaInterface';
import NotionInterface from './NotionInterface';
import SpotifyInterface from './SpotifyInterface';
import OpenAIImageGenInterface from './OpenAIImageGenInterface';
import YouTubeTranscriptInterface from './YouTubeTranscriptInterface';
import VocalChatInterface from './VocalChatInterface';
import WhatsAppInterface from './WhatsAppInterface';
import TwitterInterface from './TwitterInterface';
import CalendlyInterface from './CalendlyInterface';
import NanoBananaProInterface from './NanoBananaProInterface';
import OpenAIWhisperInterface from './OpenAIWhisperInterface';
import VapiCallsInterface from './VapiCallsInterface';
import YouTubeApiInterface from './YouTubeApiInterface';
import FrontendDesignInterface from './FrontendDesignInterface';
import BlogwatcherInterface from './BlogwatcherInterface';
import AutomationWorkflowsInterface from './AutomationWorkflowsInterface';
import DesktopControlInterface from './DesktopControlInterface';
import BuddyClawInterface from './BuddyClawInterface';
import GoogleCalendarInterface from './GoogleCalendarInterface';
import BrowserUseInterface from './BrowserUseInterface';
import TraeCliInterface from './TraeCliInterface';

export const getInterfaceComponent = (skillId: string) => {
  switch (skillId) {
    case 'brave-search':
      return BraveSearchInterface;
    case 'himalaya':
      return HimalayaInterface;
    case 'notion':
      return NotionInterface;
    case 'spotify-player':
      return SpotifyInterface;
    case 'openai-image-gen':
      return OpenAIImageGenInterface;
    case 'youtube-transcript':
      return YouTubeTranscriptInterface;
    case 'vocal-chat':
      return VocalChatInterface;
    case 'whatsapp-business':
      return WhatsAppInterface;
    case 'x-twitter':
      return TwitterInterface;
    case 'calendly-api':
      return CalendlyInterface;
    case 'nano-banana-pro':
      return NanoBananaProInterface;
    case 'openai-whisper':
      return OpenAIWhisperInterface;
    case 'vapi-calls':
      return VapiCallsInterface;
    case 'youtube-api':
      return YouTubeApiInterface;
    case 'frontend-design':
      return FrontendDesignInterface;
    case 'blogwatcher':
      return BlogwatcherInterface;
    case 'automation-workflows':
      return AutomationWorkflowsInterface;
    case 'desktop-control':
      return DesktopControlInterface;
    case 'buddyclaw':
      return BuddyClawInterface;
    case 'google-calendar':
      return GoogleCalendarInterface;
    case 'browser-use':
      return BrowserUseInterface;
    case 'trae-cli':
      return TraeCliInterface;
    default:
      return null;
  }
};
