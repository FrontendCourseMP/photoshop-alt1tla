import { writable, derived  } from "svelte/store";
import { imageInfo } from "$lib/state/image.state";
import { extractChannelPreview } from "$lib/core/channel";
import type { ChannelState, ChannelView } from "$lib/core/types";

/**
 * Реактивное состояние отображения каналов изображения.
 */
export const channelState = writable<ChannelState>({
  active: [],
});

/**
 * Связь состояния панели и каналов.
 */
export const channelPreviews = derived(
  [imageInfo, channelState],
  ([imageInfo, channelState]) => {
    if (!imageInfo?.data) return [];
    return imageInfo.channels.map((ch) => {
      return {
        channel: ch,
        active: channelState.active.includes(ch),
        preview: extractChannelPreview(
          imageInfo.data!,
          imageInfo.width,
          imageInfo.height,
          ch,
        ),
      };
    });
  },
);

/**
 * Переключение канала в глобальном состоянии
 * @param channel активный канал
 */
export function toggleChannel(channel: ChannelView) {
  channelState.update((state) => {
    const isActive = state.active.includes(channel);
    let next: ChannelView[];
    if (isActive) {
      next = state.active.filter((c) => c !== channel);
    } else {
      next = [...state.active, channel];
    }
    return {
      ...state,
      active: next,
    };
  });
}
