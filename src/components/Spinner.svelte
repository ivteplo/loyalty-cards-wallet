<script></script>

<div class="Spinner" role="progressbar" aria-busy="true" />

<style>
  .Spinner {
    border-radius: 50%;
    width: 1em;
    height: 1em;

    background: transparent;
    color: var(--primary);

    border: 0.25em solid transparent;
    border-top-color: currentColor;
    border-left-color: currentColor;

    animation: rotate 0.5s infinite linear;
  }

  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
