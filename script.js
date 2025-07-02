let rotation = 0;

window.addItem = function (event) {
  event.preventDefault();
  const input = document.getElementById("item-input");
  const name = input.value.trim();
  if (name) {
    createRow(name);
    input.value = "";
    drawWheel();
  }
};

function createRow(name) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td><input type="checkbox" class="hila"></td>
    <td><input type="checkbox" class="yuval"></td>
  `;
  document.getElementById("item-body").appendChild(row);

  row.querySelector(".hila").addEventListener("change", drawWheel);
  row.querySelector(".yuval").addEventListener("change", drawWheel);
}

function getVotes() {
  const rows = document.querySelectorAll("#item-body tr");
  const voteMap = new Map();
  rows.forEach(row => {
    const name = row.children[0].innerText;
    const hila = row.querySelector(".hila").checked;
    const yuval = row.querySelector(".yuval").checked;
    const votes = (hila ? 1 : 0) + (yuval ? 1 : 0);
    if (votes > 0) voteMap.set(name, votes);
  });
  return voteMap;
}

window.drawWheel = function () {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const center = canvas.width / 2;
  const radius = center;

  const voteMap = getVotes();
  const entries = Array.from(voteMap.entries());
  const totalVotes = entries.reduce((sum, [, count]) => sum + count, 0);
  const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (entries.length === 0) {
    ctx.font = "20px Arial";
    ctx.fillText("No selections made", center - 80, center);
    return;
  }

  let startAngle = 0;
  entries.forEach(([name, count], i) => {
    const angle = (count / totalVotes) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, startAngle + angle);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.stroke();

    const midAngle = startAngle + angle / 2;
    const x = center + Math.cos(midAngle) * (radius / 1.5);
    const y = center + Math.sin(midAngle) * (radius / 1.5);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(name, x - name.length * 3.5, y);

    startAngle += angle;
  });
};

window.spinWheel = function () {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const center = canvas.width / 2;
  const radius = center;

  const voteMap = getVotes();
  const entries = Array.from(voteMap.entries());
  const totalVotes = entries.reduce((sum, [, count]) => sum + count, 0);
  const spinDuration = 3000;
  const extraSpins = 5;
  const finalRotation = (Math.random() * 2 * Math.PI) + (extraSpins * 2 * Math.PI);
  const startRotation = rotation;
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentRotation = startRotation + easeOut * (finalRotation - startRotation);

    rotation = currentRotation % (2 * Math.PI);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);
    ctx.translate(-center, -center);
    drawWheelWithRotation(ctx, center, radius, entries, totalVotes);
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
};

function drawWheelWithRotation(ctx, center, radius, entries, totalVotes) {
  let startAngle = 0;
  const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251'];

  entries.forEach(([name, count], i) => {
    const angle = (count / totalVotes) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, startAngle + angle);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.stroke();

    const midAngle = startAngle + angle / 2;
    const x = center + Math.cos(midAngle) * (radius / 1.5);
    const y = center + Math.sin(midAngle) * (radius / 1.5);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(name, x - name.length * 3.5, y);

    startAngle += angle;
  });
}
