<template>
  <!-- <div
    class="vs-select__options vs-select-leave-active vs-select-leave-to"
    style="--vs-color: 103, 216, 177; top: 342.265px; left: 464.194px; width: 404.121px"
  >
    <div class="vs-select__options__content">
      <div class="vs-select__options__content__not-data">No data available</div>
      <button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="431" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="431" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="434" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="434" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="437" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="437" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="440" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="440" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="443" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="443" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="446" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="446" class="vs-checkbox-label"> Vuesax </label>
        </div></button
      ><button class="vs-select__option isMultiple hiddenOption">
        <div class="vs-checkbox-content vs-component--primary">
          <div class="vs-checkbox-con">
            <input id="449" type="checkbox" class="vs-checkbox" />
            <div class="vs-checkbox-mask">
              <i class="vs-icon-check"
                ><span
                  ><div class="line1"></div>
                  <div class="line2"></div></span
              ></i>
            </div>
          </div>
          <label for="449" class="vs-checkbox-label"> Vuesax </label>
        </div>
      </button>
    </div>
  </div> -->
  <v-fade-transition hide-on-leave mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  export default {
    name: 'BaseApp',

    mounted() {
      this.$vs.setTheme('dark');
    },
  };
</script>
