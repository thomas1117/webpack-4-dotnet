﻿<template>
	<div>
		<h2>Hello {{ world }}</h2>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				world: 'world'
			}
		}
	}
</script>

<style lang="scss" scoped>
	h2 {
		color: green;
	}
</style>