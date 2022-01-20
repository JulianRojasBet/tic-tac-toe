function copy(text: string): void {
  const input = document.createElement('input');
  input.value = text;

  input.select();
  input.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(input.value);

  input.remove()
}

export default copy;
