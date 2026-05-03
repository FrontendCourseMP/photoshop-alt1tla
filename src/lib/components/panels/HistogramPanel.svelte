<script lang="ts">
  import { onDestroy } from "svelte";
  import { Chart, registerables } from "chart.js";
  import type {
    HistogramData,
    HistogramMode,
    ImageInfo,
  } from "$lib/core/types";

  Chart.register(...registerables);

  interface Props {
    image: ImageInfo;
    histogramData: HistogramData;
    channel: HistogramMode;
    isLogarithmic: boolean;
  }

  let { image, histogramData, channel, isLogarithmic }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  const getChannelConfig = (ch: HistogramMode, data: HistogramData) => {
    switch (ch) {
      case "red":
        return {
          values: data.red,
          color: "rgba(255, 50, 50, 0.9)",
          label: "Red",
        };
      case "green":
        return {
          values: data.green,
          color: "rgba(50, 255, 50, 0.9)",
          label: "Green",
        };
      case "blue":
        return {
          values: data.blue,
          color: "rgba(50, 50, 255, 0.9)",
          label: "Blue",
        };
      case "alpha":
        return {
          values: data.alpha,
          color: "rgba(100, 100, 100, 0.8)",
          label: "Alpha",
        };
      case "grayscale":
        return {
          values: data.grayscale,
          color: "rgba(50, 50, 50, 0.9)",
          label: "Grayscale",
        };
      case "master":
      default:
        return {
          values: data.master,
          color: "rgba(0, 0, 0, 1)",
          label: "Master",
        };
    }
  };

  const createChart = () => {
    if (!canvas) return;
    const config = getChannelConfig(channel, histogramData);
    let totalPixels = $derived(image?.width * image?.height);

    chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: Array.from({ length: 256 }, (_, i) => i),
        datasets: [
          {
            label: config.label,
            data: config.values,
            backgroundColor: config.color,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const count = ctx.parsed.y;
                const level = ctx.parsed.x;
                return [
                  `Уровень: ${level}`,
                  `Пикселей: ${count!.toLocaleString("ru-RU")}`,
                  totalPixels > 0
                    ? `Доля: ${((count! / totalPixels) * 100).toFixed(2)}%`
                    : "",
                ];
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: { display: true, text: "Светлота (0–255)" },
            grid: { display: false },
            ticks: { maxTicksLimit: 10 },
          },
          y: {
            type: isLogarithmic ? "logarithmic" : "linear",
            display: true,
            title: { display: true, text: "Количество пикселей" },
            beginAtZero: true,
            ...(isLogarithmic && { min: 1 }),
            ticks: {
              callback: function (
                tickValue: string | number,
                index: number,
                ticks: any[],
              ) {
                const value = Number(tickValue);
                if (value >= 1_000_000)
                  return (value / 1_000_000).toFixed(1) + " млн";
                if (value >= 1_000) return (value / 1_000).toFixed(1) + " тыс.";
                return value.toString();
              },
            },
          },
        },
      },
    });
  };

  $effect(() => {
    if (!canvas || !histogramData) return;

    chartInstance?.destroy();
    createChart();
  });

  onDestroy(() => {
    chartInstance?.destroy();
  });
</script>

<div
  class="w-full h-48 bg-white/50 p-2 rounded shadow-inner border border-gray-200"
>
  <canvas bind:this={canvas}></canvas>
</div>
