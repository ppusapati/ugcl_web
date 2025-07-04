import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';

type chart = {
  type: keyof ChartTypeRegistry;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  };
}

export default component$<chart>((props) => {
  const myChart  = useSignal<HTMLCanvasElement>();
  useVisibleTask$(() => {
    if (myChart?.value) {
      Chart.register(...registerables);
      new Chart(myChart.value, {
        type: props.type,
       data:props.data
        });
    }
  });

  return (
    <div class="w-full max-w-full p-5 overflow-x-auto">
      <canvas class="max-w-full" ref={myChart} id="myChart"></canvas>
    </div>
  );
});