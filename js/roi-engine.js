// js/roi-engine.js

const ROIEngine = {

  buildProgressCircle(container) {
    const R = 88, CX = 100, CY = 100;
    const CIRC = 2 * Math.PI * R;

    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 200 200');
    svg.setAttribute('width','220'); svg.setAttribute('height','220');

    const track = document.createElementNS('http://www.w3.org/2000/svg','circle');
    track.setAttribute('cx',CX); track.setAttribute('cy',CY); track.setAttribute('r',R);
    track.setAttribute('fill','none'); track.setAttribute('stroke','#D4C9A8');
    track.setAttribute('stroke-width','10');

    const arc = document.createElementNS('http://www.w3.org/2000/svg','circle');
    arc.setAttribute('cx',CX); arc.setAttribute('cy',CY); arc.setAttribute('r',R);
    arc.setAttribute('fill','none'); arc.setAttribute('stroke','#606C38');
    arc.setAttribute('stroke-width','10'); arc.setAttribute('stroke-linecap','round');
    arc.setAttribute('stroke-dasharray',CIRC);
    arc.setAttribute('stroke-dashoffset',CIRC);
    arc.setAttribute('transform',`rotate(-90 ${CX} ${CY})`);
    arc.style.transition = 'stroke-dashoffset 1.2s ease';

    // Earth-yellow glow dot at tip
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r','6'); dot.setAttribute('fill','#DDA15E');
    dot.setAttribute('cx', CX); dot.setAttribute('cy', CY - R);
    dot.setAttribute('transform',`rotate(-90 ${CX} ${CY})`);

    svg.appendChild(track); svg.appendChild(arc); svg.appendChild(dot);
    if (container) container.appendChild(svg);

    return {
      svg,
      update(progress) {
        const p = Math.min(1, Math.max(0, progress));
        arc.setAttribute('stroke-dashoffset', CIRC * (1 - p));
        // Rotate dot along arc
        const angle = -90 + p * 360;
        dot.setAttribute('transform',`rotate(${angle} ${CX} ${CY})`);
      }
    };
  },

  calcClaimStatus(lastClaimAt) {
    if (!lastClaimAt) return { hoursElapsed:24, canClaim:true, percentComplete:1, hoursRemaining:0 };
    const hoursElapsed = (Date.now() - new Date(lastClaimAt).getTime()) / 3600000;
    const canClaim = hoursElapsed >= 24;
    return {
      hoursElapsed,
      canClaim,
      percentComplete: Math.min(1, hoursElapsed / 24),
      hoursRemaining: Math.max(0, 24 - hoursElapsed)
    };
  },

  formatCountdown(hoursRemaining) {
    const h = Math.floor(hoursRemaining);
    const m = Math.floor((hoursRemaining - h) * 60);
    const s = Math.floor(((hoursRemaining - h) * 60 - m) * 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },

  async calcDailyProfit(userId) {
    const { data } = await window.sb
      .from('investments')
      .select('amount, daily_roi_percent, expires_at')
      .eq('user_id', userId).eq('status','active');
    if (!data) return 0;
    const now = new Date();
    return data
      .filter(inv => new Date(inv.expires_at) > now)
      .reduce((sum, inv) => sum + (inv.amount * inv.daily_roi_percent / 100), 0);
  },

  async claimProfit(userId) {
    const { data, error } = await window.sb.rpc('claim_profit', { p_user_id: userId });
    if (error) throw new Error(error.message);
    return data;
  }
};

window.ROIEngine = ROIEngine;
